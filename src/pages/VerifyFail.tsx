import { useSearchParams } from "react-router-dom";

export default function VerifyFail() {
  const [params] = useSearchParams();
  const email = params.get("email");
  const error = params.get("error");
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
      <h1 style={{ color: "#dc2626", fontSize: 32, marginBottom: 16 }}>
        ❌ Xác thực email thất bại!
      </h1>
      <p style={{ fontSize: 18 }}>
        Email: <b>{email}</b>
      </p>
      <p style={{ color: "#b91c1c", marginTop: 8 }}>Lý do: {error}</p>
      <a
        href="/"
        style={{ marginTop: 24, color: "#2563eb", textDecoration: "underline" }}
      >
        Quay về trang chủ
      </a>
    </div>
  );
}
