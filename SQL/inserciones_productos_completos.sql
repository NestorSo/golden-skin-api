use master
use GoldenSkin
-- 1
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Soft Pinch Blush Encourage', 'Soft Pinch Blush Encourage', 35.00, 10, '06/10/2025', '06/10/2027', 1, 'Maquillaje', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Soft Pinch BLUSH RB.jpg', SINGLE_BLOB) AS Imagen;

-- 2
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Soft Pinch Blush Believe', 'Soft Pinch Blush Believe', 35.00, 10, '06/10/2025', '06/10/2027', 1, 'Maquillaje', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\blush believe RB.jpg', SINGLE_BLOB) AS Imagen;

-- 3
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Soft Pinch Blush Worth', 'Soft Pinch Blush Worth', 35.00, 10, '06/10/2025', '06/10/2027', 1, 'Maquillaje', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\blush worth RB.jpg', SINGLE_BLOB) AS Imagen;

-- 4
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Soft Pinch Lip oil Joy', 'Soft Pinch Lip oil Joy', 32.00, 20, '06/10/2025', '06/10/2027', 1, 'Maquillaje', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Soft Pinch Lip oil joy.jpg', SINGLE_BLOB) AS Imagen;

-- 5
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Soft Pinch Lip oil Hope', 'Soft Pinch Lip oil Hope', 32.00, 10, '06/10/2025', '06/10/2027', 1, 'Maquillaje', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Soft Pinch Lip oil hope.jpg', SINGLE_BLOB) AS Imagen;

-- 6
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Soft Pinch Lip oil serenity', 'Soft Pinch Lip oil serenity', 32.00, 10, '06/10/2025', '06/10/2027'L, 1, 'Maquillaje', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Soft Pinch Lip oil serenity.jpg', SINGLE_BLOB) AS Imagen;

-- 7
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Multi Peptide lash and brown', 'Multi Peptide lash and brown', 25.00, 50, '06/10/2025', '06/10/2027', 2, 'Maquillaje', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Multi Peptide lash and brown.jpg', SINGLE_BLOB) AS Imagen;

-- 8
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Salicylic Acid 2% Solution', 'Salicylic Acid 2% Solution', 16.00, 60, '06/10/2025', '06/10/2027', 2, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Salicylic Acid 2% Solution.jpg', SINGLE_BLOB) AS Imagen;

-- 9
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Niacinamide 30ml', 'Niacinamide 30ml', 17.00, 1, '06/10/2025', '06/10/2027', 2, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Niacinamide 30ml.jpg', SINGLE_BLOB) AS Imagen;

-- 10
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Niacinamide 60ml', 'Niacinamide 60ml', 26.00, 2, '06/10/2025', '06/10/2027', 2, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Niacinamide 60ml.jpg', SINGLE_BLOB) AS Imagen;

-- 11
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Caffeine Solution 5%', 'Caffeine Solution 5%', 19.00, 5, '06/10/2025', '06/10/2027', 2, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Caffeine Solution 5percent.jpg', SINGLE_BLOB) AS Imagen;

-- 12
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Alpha Arbutin 2%', 'Alpha Arbutin 2%', 19.00, 5, '06/10/2025', '06/10/2027', 2, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Alpha Arbutin 2porciento.jpg', SINGLE_BLOB) AS Imagen;

-- 13
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Peeling Solution', 'Peeling Solution', 19.00, 6, '06/10/2025', '06/10/2027', 2, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Peeling Solution.jpg', SINGLE_BLOB) AS Imagen;

-- 14
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Hyaluronic Acid 2%', 'Hyaluronic Acid 2%', 19.00, 8, '06/10/2025', '06/10/2027', 2, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Hyaluronic Acid 2porciento.jpg', SINGLE_BLOB) AS Imagen;

-- 15
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Vitamina C Suspension', 'Vitamina C Suspension', 15.00, 3, '06/10/2025', '06/10/2027', 2, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Vitamina C Suspension.jpg', SINGLE_BLOB) AS Imagen;


-- 16
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Natural Moisturizing Factors 100ml', 'Natural Moisturizing Factors 100ml', 26.00, 50, '06/10/2025', '06/10/2027', 2, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Natural Moisturizing Factors 100ml.jpg', SINGLE_BLOB) AS Imagen;

-- 17
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Natural Moisturizing Factors 30ml', 'Natural Moisturizing Factors 30ml', 16.00, 40, '06/10/2025', '06/10/2027', 2, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Natural Moisturizing Factors 30ml.jpg', SINGLE_BLOB) AS Imagen;

-- 18
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Azelaic Acid Suspension', 'Azelaic Acid Suspension', 20.00, 50, '06/10/2025', '06/10/2027', 2, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Azelaic Acid Suspension.jpg', SINGLE_BLOB) AS Imagen;

-- 19
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Facial Spray Agua de rosas', 'Facial Spray Agua de rosas', 10.00, 20, '06/10/2025', '06/10/2027', 3, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Facial Spray Agua de rosasMB.jpg', SINGLE_BLOB) AS Imagen;

-- 20
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Glycolic Acid 7%', 'Glycolic Acid 7%', 25.00, 13, '06/10/2025', '06/10/2027', 2, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Glycolic Acid 7porciento.jpg', SINGLE_BLOB) AS Imagen;

-- 21
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Foaming Facial Cleanser 16onz', 'Foaming Facial Cleanser 16onz', 30.00, 130, '06/10/2025', '06/10/2027', 4, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Foaming Facial Cleanser 16onz.jpg', SINGLE_BLOB) AS Imagen;

-- 22
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Foaming Facial Cleanser 3 onz', 'Foaming Facial Cleanser 3 onz', 8.00, 10, '06/10/2025', '06/10/2027', 4, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Foaming Facial Cleanser 3 onz.jpg', SINGLE_BLOB) AS Imagen;

-- 23
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Hydrating Facial Cleanser 16 onz', 'Hydrating Facial Cleanser 16 onz', 30.00, 10, '06/10/2025', '06/10/2027', 4, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Hydrating Facial Cleanser 16 onz.jpg', SINGLE_BLOB) AS Imagen;

-- 24
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Hydrating Facial Cleanser 3 onz', 'Hydrating Facial Cleanser 3 onz', 8.00, 70, '06/10/2025', '06/10/2027', 4, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Hydrating Facial Cleanser 3 onz.jpg', SINGLE_BLOB) AS Imagen;

-- 25
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Sebium Gel Moussant', 'Sebium Gel Moussant', 29.00, 80, '06/10/2025', '06/10/2027', 5, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Sebium Gel Moussant 100ml.jpg', SINGLE_BLOB) AS Imagen;

-- 26
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Sensibio Gel Moussant', 'Sensibio Gel Moussant', 29.00, 50, '06/10/2025', '06/10/2027', 5, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Sensibio Gel Moussant.jpg', SINGLE_BLOB) AS Imagen;

-- 27
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Daily Facial cleanser 16 onz', 'Daily Facial cleanser 16 onz', 27.00, 20, '06/10/2025', '06/10/2027', 6, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Daily Facial cleanser 16 onz.jpg', SINGLE_BLOB) AS Imagen;

-- 28
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Daily Facial cleanser 8 onz', 'Daily Facial cleanser 8 onz', 20.00, 30, '06/10/2025', '06/10/2027', 6, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Daily Facial cleanser 16 onz.jpg', SINGLE_BLOB) AS Imagen;
----------------------------------------------------------------------
-- 29
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Gentle Skin Cleanser 16onz', 'Gentle Skin Cleanser 16onz', 27.00, 40, '06/10/2025', '06/10/2027', 6, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Gentle Skin Cleanser 16onz.jpg', SINGLE_BLOB) AS Imagen;

-- 30
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Gentle Skin Cleanser 8onz', 'Gentle Skin Cleanser 8onz', 20.00, 30, '06/10/2025', '06/10/2027', 6, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Gentle Skin Cleanser 8onz.jpg', SINGLE_BLOB) AS Imagen;

-- 31
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Acne Control cleanser', 'Acne Control cleanser', 28.00, 90, '06/10/2025', '06/10/2027', 4, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Acne Control cleanser.jpg', SINGLE_BLOB) AS Imagen;

-- 32
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Renewing Cleanser', 'Renewing Cleanser', 25.00, 30, '06/10/2025', '06/10/2027', 4, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Renewing Cleanser.jpg', SINGLE_BLOB) AS Imagen;

-- 33
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'SA Lotion Rough&Bumpy Skin', 'SA Lotion Rough&Bumpy Skin', 28.00, 50, '06/10/2025', '06/10/2027', 4, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\SA Lotion Rough&Bumpy Skin.jpg', SINGLE_BLOB) AS Imagen;

-- 34
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'SA Cream Rough&Bumpy Skin', 'SA Cream Rough&Bumpy Skin', 30.00, 10, '06/10/2025', '06/10/2027', 4, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\SA Cream Rough&Bumpy Skin.jpg', SINGLE_BLOB) AS Imagen;

-- 35
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Sebium H2O Agua micelar', 'Sebium H2O Agua micelar', 32.00, 40, '06/10/2025', '06/10/2027', 5, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Sebium H2O Agua micelar.jpg', SINGLE_BLOB) AS Imagen;

-- 36
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Sensibio Agua micelar', 'Sensibio Agua micelar', 32.00, 40, '06/10/2025', '06/10/2027', 5, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Sensibio Agua micelar.jpg', SINGLE_BLOB) AS Imagen;

-- 37
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Gel de baño Vitamina C', 'Gel de baño Vitamina C', 20.00, 40, '06/10/2025', '06/10/2027', 7, 'Baño', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Gel de baño Vitamina C TH.jpg', SINGLE_BLOB) AS Imagen;

-- 38
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Gel de bano Watermelon', 'Gel de bano Watermelon', 20.00, 20, '06/10/2025', '06/10/2027', 7, 'Baño', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Gel de bano Watermelon TH.jpg', SINGLE_BLOB) AS Imagen;

-- 39
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Exfoliante coco colada', 'Exfoliante coco colada', 20.00, 20, '06/10/2025', '06/10/2027', 7, 'Baño', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Exfoliante coco colada TH.jpg', SINGLE_BLOB) AS Imagen;

-- 40
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Exfoliante watermelon', 'Exfoliante watermelon', 20.00, 10, '06/10/2025', '06/10/2027', 7, 'Baño', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Exfoliante watermelon TH.jpg', SINGLE_BLOB) AS Imagen;

-- 41
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Exfoliante fresa', 'Exfoliante fresa', 20.00, 10, '06/10/2025', '06/10/2027', 7, 'Baño', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Exfoliante fresa TH.jpg', SINGLE_BLOB) AS Imagen;

-- 42
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Exfoliante cotton candy', 'Exfoliante cotton candy', 20.00, 10, '06/10/2025', '06/10/2027', 7, 'Baño', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Exfoliante cotton candy.jpg', SINGLE_BLOB) AS Imagen;

-- 43
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Polvo depilador', 'Polvo depilador', 15.00, 40, '06/10/2025', '06/10/2027', 8, 'Otro', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Polvo depilador.jpg', SINGLE_BLOB) AS Imagen;

-- 44
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Body clear body wash', 'Body clear body wash', 20.00, 60, '06/10/2025', '06/10/2027', 9, 'Baño', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Body clear body wash.jpg', SINGLE_BLOB) AS Imagen;

-- 45
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Acne Foaming cream cleanser', 'Acne Foaming cream cleanser', 25.00, 40, '06/10/2025', '06/10/2027', 4, 'Baño', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Acne Foaming cream cleanser.jpg', SINGLE_BLOB) AS Imagen;


-- 46
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Acne control gel', 'Acne control gel', 25.00, 70, '06/10/2025', '06/10/2027', 4, 'Baño', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Acne control gel.jpg', SINGLE_BLOB) AS Imagen;

-- 47
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Resurfacing retinol serum', 'Resurfacing retinol serum', 25.00, 80, '06/10/2025', '06/10/2027', 4, 'Serum', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Resurfacing retinol serum.jpg', SINGLE_BLOB) AS Imagen;

-- 48
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Eye repair cream', 'Eye repair cream', 23.00, 30, '06/10/2025', '06/10/2027', 4, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Eye repair cream.jpg', SINGLE_BLOB) AS Imagen;

-- 49
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Facial moisturizing Lotion AM', 'Facial moisturizing Lotion AM', 26.00, 70, '06/10/2025', '06/10/2027', 4, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Facial moisturizing Lotion AM.jpg', SINGLE_BLOB) AS Imagen;

-- 50
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Facial moisturizing Lotion PM', 'Facial moisturizing Lotion PM', 26.00, 30, '06/10/2025', '06/10/2027', 4, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Facial moisturizing Lotion PM.jpg', SINGLE_BLOB) AS Imagen;

-- 51
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Skin renewing Vitamina C', 'Skin renewing Vitamina C', 15.00, 90, '06/10/2025', '06/10/2027', 4, 'Serum', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Skin renewing Vitamina C.jpg', SINGLE_BLOB) AS Imagen;

-- 52
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Hydro Boost', 'Hydro Boost', 30.00, 14, '06/10/2025', '06/10/2027', 9, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Hydro Boost.jpg', SINGLE_BLOB) AS Imagen;

-- 53
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Daily Moisturizing Lotion', 'Daily Moisturizing Lotion', 25.00, 20, '06/10/2025', '06/10/2027', 4, 'Skincare', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Daily Moisturizing Lotion.jpg', SINGLE_BLOB) AS Imagen;

-- 54
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Hydro Boost protector solar', 'Hydro Boost protector solar', 25.00, 50, '06/10/2025', '06/10/2027', 9, 'Protector Solar', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Hydro Boost protector solar.jpg', SINGLE_BLOB) AS Imagen;

-- 55
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Protector solar Ultra sheer', 'Protector solar Ultra sheer', 22.00, 70, '06/10/2025', '06/10/2027', 9, 'Protector Solar', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Protector solar Ultra sheer.jpg', SINGLE_BLOB) AS Imagen;

-- 56
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Oil control mineral', 'Oil control mineral', 25.00, 40, '06/10/2025', '06/10/2027', 6, 'Protector Solar', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Oil control mineral.jpg', SINGLE_BLOB) AS Imagen;

-- 57
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Oil control anti brillo sin tinte protector solar', 'Oil control anti brillo sin tinte protector solar', 30.00, 110, '06/10/2025', '06/10/2027', 6, 'Protector Solar', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Oil control anti brillo sin tinte protector solar.jpg', SINGLE_BLOB) AS Imagen;

-- 58
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Oil control anti brillo con tinte protector solar', 'Oil control anti brillo con tinte protector solar', 30.00, 50, '06/10/2025', '06/10/2027', 6, 'Protector Solar', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Oil control anti brillo con tinte protector solar.jpg', SINGLE_BLOB) AS Imagen;

-- 59
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Pigment control protector solar', 'Pigment control protector solar', 30.00, 70, '06/10/2025', '06/10/2027', 6, 'Protector Solar', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Pigment control protector solar.jpg', SINGLE_BLOB) AS Imagen;

-- 60
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Pigment control protector solar con tinte', 'Pigment control protector solar con tinte', 30.00, 10, '06/10/2025', '06/10/2027', 6, 'Protector Solar', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Pigment control protector solar con tinte.jpg', SINGLE_BLOB) AS Imagen;


-- 61
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Photoaging control protector solar', 'Photoaging control protector solar', 30.00, 20, '06/10/2025', '06/10/2027', 6, 'Protector Solar', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Photoaging control protector solar.jpg', SINGLE_BLOB) AS Imagen;

-- 62
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Photoderm Mineral protector solar', 'Photoderm Mineral protector solar', 25.00, 50, '06/10/2025', '06/10/2027', 3, 'Protector Solar', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Photoderm Mineral protector solar.jpg', SINGLE_BLOB) AS Imagen;

-- 63
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Photoderm Creme protector solar', 'Photoderm Creme protector solar', 25.00, 50, '06/10/2025', '06/10/2027', 3, 'Protector Solar', 1,
BulkColumn FROM OPENROWSET(BULK 'C:\Images\Photoderm Creme protector solar.jpg', SINGLE_BLOB) AS Imagen;

-- 64
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, FechaVencimiento, IdMarca, Categoria, EstadoProducto, Imagen)
SELECT 'Polvo depilador', 'Polvo depilador', 15.00, 4, '06/10/2025', '06/10/2027', 1, 'Otro', 1,
BulkColumn FROM OPENROWSET(BULK '"C:\Images\Polvo depilador.jpg"', SINGLE_BLOB) AS Imagen;


-- insersiones sin img
use master
use GoldenSkin
use GoldenSkin;

-- Update products with IdMarca 20 to IdMarca 2
UPDATE Productos
SET IdMarca = 2
WHERE IdMarca = 20;

-- Update products with IdMarca 30 to IdMarca 3
UPDATE Productos
SET IdMarca = 3
WHERE IdMarca = 30;

-- Updating quantities for all 64 products by adding 50 to their current stock

-- 1
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Soft Pinch Blush Encourage';

-- 2
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Soft Pinch Blush Believe';

-- 3
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Soft Pinch Blush Worth';

-- 4
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Soft Pinch Lip oil Joy';

-- 5
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Soft Pinch Lip oil Hope';

-- 6
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Soft Pinch Lip oil serenity';

-- 7
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Multi Peptide lash and brown';

-- 8
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Salicylic Acid 2% Solution';

-- 9
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Niacinamide 30ml';

-- 10
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Niacinamide 60ml';

-- 11
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Caffeine Solution 5%';

-- 12
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Alpha Arbutin 2%';

-- 13
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Peeling Solution';

-- 14
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Hyaluronic Acid 2%';

-- 15
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Vitamina C Suspension';

-- 16
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Natural Moisturizing Factors 100ml';

-- 17
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Natural Moisturizing Factors 30ml';

-- 18
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Azelaic Acid Suspension';

-- 19
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Facial Spray Agua de rosas';

-- 20
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Glycolic Acid 7%';

-- 21
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Foaming Facial Cleanser 16onz';

-- 22
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Foaming Facial Cleanser 3 onz';

-- 23
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Hydrating Facial Cleanser 16 onz';

-- 24
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Hydrating Facial Cleanser 3 onz';

-- 25
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Sebium Gel Moussant';

-- 26
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Sensibio Gel Moussant';

-- 27
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Daily Facial cleanser 16 onz';

-- 28
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Daily Facial cleanser 8 onz';

-- 29
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Gentle Skin Cleanser 16onz';

-- 30
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Gentle Skin Cleanser 8onz';

-- 31
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Acne Control cleanser';

-- 32
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Renewing Cleanser';

-- 33
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'SA Lotion Rough&Bumpy Skin';

-- 34
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'SA Cream Rough&Bumpy Skin';

-- 35
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Sebium H2O Agua micelar';

-- 36
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Sensibio Agua micelar';

-- 37
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Gel de baño Vitamina C';

-- 38
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Gel de bano Watermelon';

-- 39
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Exfoliante coco colada';

-- 40
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Exfoliante watermelon';

-- 41
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Exfoliante fresa';

-- 42
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Exfoliante cotton candy';

-- 43
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Polvo depilador';

-- 44
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Body clear body wash';

-- 45
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Acne Foaming cream cleanser';

-- 46
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Acne control gel';

-- 47
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Resurfacing retinol serum';

-- 48
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Eye repair cream';

-- 49
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Facial moisturizing Lotion AM';

-- 50
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Facial moisturizing Lotion PM';

-- 51
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Skin renewing Vitamina C';

-- 52
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Hydro Boost';

-- 53
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Daily Moisturizing Lotion';

-- 54
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Hydro Boost protector solar';

-- 55
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Protector solar Ultra sheer';

-- 56
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Oil control mineral';

-- 57
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Oil control anti brillo sin tinte protector solar';

-- 58
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Oil control anti brillo con tinte protector solar';

-- 59
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Pigment control protector solar';

-- 60
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Pigment control protector solar con tinte';

-- 61
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Photoaging control protector solar';

-- 62
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Photoderm Mineral protector solar';

-- 63
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Photoderm Creme protector solar';

-- 64
UPDATE Productos SET Cantidad = Cantidad + 50 WHERE NombreProducto = 'Polvo depilador';

use GoldenSkin
-- Actualizar categoría a 'Limpieza' para productos de baño
UPDATE Productos SET Categoria = 'Limpieza' WHERE NombreProducto = 'Gel de baño Vitamina C';
UPDATE Productos SET Categoria = 'Limpieza' WHERE NombreProducto = 'Gel de bano Watermelon';
UPDATE Productos SET Categoria = 'Limpieza' WHERE NombreProducto = 'Exfoliante coco colada';
UPDATE Productos SET Categoria = 'Limpieza' WHERE NombreProducto = 'Exfoliante watermelon';
UPDATE Productos SET Categoria = 'Limpieza' WHERE NombreProducto = 'Exfoliante fresa';
UPDATE Productos SET Categoria = 'Limpieza' WHERE NombreProducto = 'Exfoliante cotton candy';
UPDATE Productos SET Categoria = 'Limpieza' WHERE NombreProducto = 'Polvo depilador';
UPDATE Productos SET Categoria = 'Limpieza' WHERE NombreProducto = 'Body clear body wash';

-- Actualizar categoría a 'Bloqueadores solares' para protectores solares
UPDATE Productos SET Categoria = 'Bloqueadores solares' WHERE NombreProducto = 'Hydro Boost protector solar';
UPDATE Productos SET Categoria = 'Bloqueadores solares' WHERE NombreProducto = 'Protector solar Ultra sheer';
UPDATE Productos SET Categoria = 'Bloqueadores solares' WHERE NombreProducto = 'Oil control mineral';
UPDATE Productos SET Categoria = 'Bloqueadores solares' WHERE NombreProducto = 'Oil control anti brillo sin tinte protector solar';
UPDATE Productos SET Categoria = 'Bloqueadores solares' WHERE NombreProducto = 'Oil control anti brillo con tinte protector solar';
UPDATE Productos SET Categoria = 'Bloqueadores solares' WHERE NombreProducto = 'Pigment control protector solar';
UPDATE Productos SET Categoria = 'Bloqueadores solares' WHERE NombreProducto = 'Pigment control protector solar con tinte';
UPDATE Productos SET Categoria = 'Bloqueadores solares' WHERE NombreProducto = 'Photoaging control protector solar';
UPDATE Productos SET Categoria = 'Bloqueadores solares' WHERE NombreProducto = 'Photoderm Mineral protector solar';
UPDATE Productos SET Categoria = 'Bloqueadores solares' WHERE NombreProducto = 'Photoderm Creme protector solar';


UPDATE Productos SET Categoria = 'Limpieza' WHERE NombreProducto = 'Acne Foaming cream cleanser';
UPDATE Productos SET Categoria = 'Limpieza' WHERE NombreProducto = 'Acne control gel';