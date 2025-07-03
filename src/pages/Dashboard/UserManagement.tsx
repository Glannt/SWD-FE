import { useEffect, useState, useMemo } from "react";
import { userService } from "../../services/user.service";
import { User, UserRole, UserStatus } from "../../types/api";
import { FiSearch } from "react-icons/fi";
import { FaUserGraduate, FaUserTie, FaUserFriends } from "react-icons/fa";
import { MdSupervisorAccount } from "react-icons/md";
import { useRef } from "react";
import { ChangeEvent, FormEvent } from "react";

const ROLE_OPTIONS = [
  {
    value: "admin",
    label: "Quản trị viên",
    icon: <FaUserTie className="inline mr-1" />,
  },
  {
    value: "student",
    label: "Học sinh",
    icon: <FaUserGraduate className="inline mr-1" />,
  },
];
const STATUS_OPTIONS = [
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Đã rời hệ thống" },
];

function getRoleLabel(role: string) {
  switch (role) {
    case "student":
      return (
        <>
          {" "}
          <FaUserGraduate className="inline mr-1" /> Học sinh
        </>
      );
    case "parent":
      return (
        <>
          {" "}
          <FaUserFriends className="inline mr-1" /> Phụ huynh
        </>
      );
    case "advisor":
      return (
        <>
          {" "}
          <MdSupervisorAccount className="inline mr-1" /> Cố vấn
        </>
      );
    default:
      return (
        <>
          {" "}
          <FaUserTie className="inline mr-1" /> {role}
        </>
      );
  }
}
function getStatusLabel(status: string) {
  if (status === "active")
    return (
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
        Đang hoạt động
      </span>
    );
  if (status === "inactive")
    return (
      <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-semibold">
        Đã rời hệ thống
      </span>
    );
  return (
    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-semibold">
      {status}
    </span>
  );
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [form, setForm] = useState<{
    fullName: string;
    email: string;
    role: string;
    status: string;
    password?: string;
  }>({
    fullName: "",
    email: "",
    role: "student",
    status: "active",
    password: "",
  });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lọc và tìm kiếm
  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (role !== "all") filtered = filtered.filter((u) => u.role === role);
    if (status !== "all")
      filtered = filtered.filter((u) => (u.status || "active") === status);
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.fullName.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s)
      );
    }
    return filtered;
  }, [users, role, status, search]);

  // Phân trang
  const pagedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Modal logic
  const openCreate = () => {
    setForm({
      fullName: "",
      email: "",
      role: "student",
      status: "active",
      password: "",
    });
    setModalMode("create");
    setEditId(null);
    setShowModal(true);
  };
  const openEdit = (user: User) => {
    setForm({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status || "active",
    });
    setModalMode("edit");
    setEditId(user._id);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        await userService.createUser({
          ...form,
          role: form.role as UserRole,
          status: form.status as UserStatus,
          password: form.password || "",
        });
      } else if (modalMode === "edit" && editId) {
        const { fullName, role, status } = form;
        await userService.updateUser(editId, {
          fullName,
          role: role as UserRole,
          status: status as UserStatus,
        });
      }
      closeModal();
      fetchUsers();
    } catch {
      alert("Có lỗi xảy ra khi lưu user!");
    }
  };

  // Xóa user
  const handleDelete = async (user: User) => {
    if (!window.confirm(`Bạn có chắc muốn xóa user ${user.fullName}?`)) return;
    try {
      await userService.deleteUser(user._id);
      fetchUsers();
    } catch {
      alert("Xóa user thất bại!");
    }
  };

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch {
      setError("Không thể tải danh sách user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-1/3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FiSearch />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className="border rounded-lg px-3 py-2 text-sm bg-white"
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">Tất cả vai trò</option>
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          className="border rounded-lg px-3 py-2 text-sm bg-white"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">Tất cả trạng thái</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          onClick={openCreate}
        >
          + Tạo mới user
        </button>
      </div>
      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow bg-white">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 border-b text-left">Họ tên</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Vai trò</th>
                <th className="py-2 px-4 border-b text-left">Trạng thái</th>
                <th className="py-2 px-4 border-b text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pagedUsers.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b flex items-center gap-3">
                    <img
                      src={
                        user.avatar ||
                        `https://ui-avatars.com/api/?name=${user.fullName}&background=random&size=24`
                      }
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full"
                    />
                    {user.fullName}
                  </td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">
                    {getRoleLabel(user.role)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {getStatusLabel(user.status || "active")}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-800"
                        onClick={() => openEdit(user)}
                      >
                        Sửa
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(user)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">
              {modalMode === "create" ? "Tạo mới user" : "Cập nhật user"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Họ tên</label>
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={form.fullName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  type="email"
                  value={form.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                  disabled={modalMode === "edit"}
                />
              </div>
              {modalMode === "create" && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mật khẩu
                  </label>
                  <input
                    className="w-full border rounded-lg px-3 py-2"
                    type="password"
                    value={form.password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Vai trò
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={form.role}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setForm((f) => ({ ...f, role: e.target.value }))
                  }
                  required
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Trạng thái
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={form.status}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setForm((f) => ({ ...f, status: e.target.value }))
                  }
                  required
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200"
                  onClick={closeModal}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
