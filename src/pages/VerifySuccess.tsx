import { useSearchParams } from "react-router-dom";

export default function VerifySuccess() {
  const [params] = useSearchParams();
  const email = params.get("email");
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ color: "#16a34a", fontSize: 32, marginBottom: 16 }}>
        ✅ Xác thực email thành công!
      </h1>
      <p style={{ fontSize: 18 }}>
        Chào mừng <b>{email}</b>! Tài khoản của bạn đã được xác thực.
      </p>
      <a
        href="/"
        style={{ marginTop: 24, color: "#2563eb", textDecoration: "underline" }}
      >
        Quay về trang chủ
      </a>
    </div>
  );
}
