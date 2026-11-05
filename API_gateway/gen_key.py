from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

# Tạo cặp khóa RSA 2048-bit
key = rsa.generate_private_key(public_exponent=65537, key_size=2048)

# Xuất Private Key (chuẩn PKCS#8 bắt buộc cho Java)
private_pem = key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption()
)

# Xuất Public Key
public_pem = key.public_key().public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)

with open('privateKey.pem', 'wb') as f:
    f.write(private_pem)
with open('publicKey.pem', 'wb') as f:
    f.write(public_pem)

print("Tạo 2 file khóa RSA thành công!")