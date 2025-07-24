import { useState, useEffect } from 'react';

import {
  fetchSummary,
  fetchSessions,
  fetchChatUsers,
} from '../../services/admin-dashboard.service';

interface Session {
  sessionId: string;
  createdAt: string;
  tag: string | null;
}

interface UserWithSessions {
  user_id: string;
  fullName: string;
  email: string;
  sessions: Session[];
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [sessions, setSessions] = useState<UserWithSessions[]>([]);
  const [chatUsers, setChatUsers] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetchSummary()
      .then((data) => {
        setSummary(data);
      })
      .catch((err) => {
        console.error('Không thể tải dữ liệu thống kê', err);
      });
    fetchSessions()
      .then((data) => {
        setSessions(data as unknown as UserWithSessions[]);
      })
      .catch((err) => {
        console.error('Không thể tải danh sách session chat', err);
        // setError('Đã xảy ra lỗi khi tải dữ liệu');
      });
    fetchChatUsers()
      .then((data) => setChatUsers(data))
      .catch((err) => {
        console.error('Không thể tải danh sách user đã chat', err);
      });
  }, []);

  return (
    <div className='p-8'>
      {/* Main content nằm dưới topbar */}
      <div className='flex-1 p-8 overflow-y-auto bg-gray-50'>
        {/* Thống kê tổng quan dạng card đẹp */}
        <div className='mb-8'>
          <h2 className='text-2xl font-bold mb-6'>Thống kê tổng quan</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6'>
            {/* Card tổng số lượt truy cập */}
            <div className='rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-center'>
              <div className='w-12 h-12 flex items-center justify-center bg-blue-100 rounded-xl mb-3'>
                <svg
                  className='w-7 h-7 text-blue-600'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3 12a9 9 0 1118 0 9 9 0 01-18 0zm9-4v4l3 3'
                  />
                </svg>
              </div>
              <div className='text-3xl font-bold text-blue-600'>
                {String(summary?.totalVisits ?? '--')}
              </div>
              <div className='mt-2 text-gray-500'>Tổng lượt truy cập</div>
            </div>
            {/* Card tổng số user đã chat */}
            <div className='rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-center'>
              <div className='w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-xl mb-3'>
                <svg
                  className='w-7 h-7 text-indigo-600'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              </div>
              <div className='text-3xl font-bold text-indigo-600'>
                {String(summary?.totalUsersChatted ?? '--')}
              </div>
              <div className='mt-2 text-gray-500'>User đã chat</div>
            </div>
            {/* Card tổng số session chat */}
            <div className='rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-center'>
              <div className='w-12 h-12 flex items-center justify-center bg-purple-100 rounded-xl mb-3'>
                <svg
                  className='w-7 h-7 text-purple-600'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M9 20H4v-2a3 3 0 015.356-1.857M15 10a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
              </div>
              <div className='text-3xl font-bold text-purple-600'>
                {String(summary?.totalSessions ?? '--')}
              </div>
              <div className='mt-2 text-gray-500'>Session chat</div>
            </div>
            {/* Card placeholder hoặc số liệu khác nếu có */}
            <div className='rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-center'>
              <div className='w-12 h-12 flex items-center justify-center bg-green-100 rounded-xl mb-3'>
                <svg
                  className='w-7 h-7 text-green-600'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <div className='text-3xl font-bold text-green-600'>--</div>
              <div className='mt-2 text-gray-500'>Số liệu khác</div>
            </div>
          </div>
        </div>
        {/* Biểu đồ và bảng đẹp như ecommerce */}
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8'></div>
        {/* Bảng session chat */}
        <div className='mb-10'>
          <h2 className='text-xl font-bold mb-4'>Danh sách session chat</h2>
          <div className='overflow-x-auto rounded-xl shadow bg-white'>
            <table className='table-auto w-full border'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='py-2 px-4 border-b text-left'>Họ tên</th>
                  <th className='py-2 px-4 border-b text-left'>Email</th>
                  <th className='py-2 px-4 border-b text-left'>Session ID</th>
                  <th className='py-2 px-4 border-b text-left'>Tag</th>
                  <th className='py-2 px-4 border-b text-left'>
                    Thời gian tạo
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.length > 0 ? (
                  sessions.flatMap((user) =>
                    user.sessions.map((session) => (
                      <tr key={`${user.user_id}-${session.sessionId}`}>
                        <td className='py-2 px-4 border-b'>
                          {user.fullName || '-'}
                        </td>
                        <td className='py-2 px-4 border-b'>
                          {user.email || '-'}
                        </td>
                        <td className='py-2 px-4 border-b'>
                          {session.sessionId}
                        </td>
                        <td className='py-2 px-4 border-b'>
                          {session.tag ? (
                            <span className='text-green-600 font-medium'>
                              {session.tag}
                            </span>
                          ) : (
                            <span className='text-gray-500 italic'>
                              Không có tag
                            </span>
                          )}
                        </td>
                        <td className='py-2 px-4 border-b'>
                          {session.createdAt
                            ? new Date(session.createdAt).toLocaleString(
                                'vi-VN'
                              )
                            : '-'}
                        </td>
                      </tr>
                    ))
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className='text-center py-4 text-gray-500 italic'
                    >
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Bảng user đã chat */}
        <div className='mb-10'>
          <h2 className='text-xl font-bold mb-4'>User đã từng chat</h2>
          <div className='overflow-x-auto rounded-xl shadow bg-white'>
            <table className='min-w-full'>
              <thead>
                <tr className='bg-gray-50'>
                  <th className='py-2 px-4 border-b text-left'>Họ tên</th>
                  <th className='py-2 px-4 border-b text-left'>Email</th>
                </tr>
              </thead>
              <tbody>
                {chatUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className='text-center py-4'
                    >
                      Không có user nào.
                    </td>
                  </tr>
                ) : (
                  chatUsers
                    .filter((u) => u && typeof u === 'object')
                    .map((u, idx) => {
                      const user = u as Record<string, unknown>;
                      if (!user) return null;
                      return (
                        <tr key={idx}>
                          <td className='py-2 px-4 border-b'>
                            {String(
                              user.fullName || user.name || user.user_id || '-'
                            )}
                          </td>
                          <td className='py-2 px-4 border-b'>
                            {String(user.email || '-')}
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
