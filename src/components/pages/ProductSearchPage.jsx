+import React, { useState } from 'react';
+import ProductSearch from '../ProductSearch';
+import ResultsTable from '../ResultsTable';
+import GoogleSheetSync from '../GoogleSheetSync';
+import DatabaseSync from '../DatabaseSync';
+
+function ProductSearchPage() {
+  const [searchResults, setSearchResults] = useState([]);
+
+  return (
+    <div className="space-y-6">
+      {/* Header */}
+      <div>
+        <h1 className="text-2xl font-bold text-gray-900">Pesquisar Produtos</h1>
+        <p className="text-gray-600 mt-1">
+          Digite os produtos que deseja pesquisar nos mercados
+        </p>
+      </div>
+
+      {/* Search Form */}
+      <ProductSearch onResults={setSearchResults} />
+      
+      {/* Results */}
+      {searchResults.length > 0 && (
+        <>
+          <ResultsTable results={searchResults} />
+          
+          {/* Action Buttons */}
+          <div className="flex flex-col sm:flex-row gap-4 justify-end">
+            <DatabaseSync data={searchResults} />
+            <GoogleSheetSync data={searchResults} />
           </div>
-        </div>
+        </>
+      )}
+    </div>
+  );
+}
+
+export default ProductSearchPage;
+