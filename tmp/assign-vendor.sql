UPDATE products
SET "vendorId" = 'b1111111-1111-4111-8111-111111111111'
WHERE id = '698b711c-53fc-4c30-9294-b9b1a2ef0e53'
RETURNING id, name, "vendorId", status;
