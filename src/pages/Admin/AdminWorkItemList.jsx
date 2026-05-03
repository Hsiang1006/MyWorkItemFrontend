import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  useGetWorkItemsQuery,
  useDeleteWorkItemMutation
} from '../../features/workItem/workItemApi';

const AdminWorkItemList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const sortOrder = searchParams.get('sort') || 'latest';

  const { data: workItems = [], isLoading, isError, refetch } = useGetWorkItemsQuery(sortOrder);
  const [deleteItem] = useDeleteWorkItemMutation();

  const handleSortChange = (e) => {
    setSearchParams({ sort: e.target.value });
  };

  const handleDelete = async (id) => {
    if (window.confirm('確定要永久刪除這筆資料嗎？此操作無法復原。')) {
      try {
        await deleteItem(id).unwrap();
        alert('刪除成功！');
      } catch (err) {
        alert('刪除失敗: ' + (err.data?.message || '發生錯誤'));
      }
    }
  };

  const getItemId = (item) => item.id || item.Id || item.workItemId;

  if (isLoading) return <div className="text-center mt-5"><div className="spinner-border text-primary" /></div>;
  if (isError) return <div className="alert alert-danger mt-3">載入列表失敗，請稍後再試或確認您的權限。</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h4 className="fw-bold mb-0 text-primary">管理員專區</h4>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={sortOrder}
            onChange={handleSortChange}
          >
            <option value="latest">最新</option>
            <option value="oldest">最舊</option>
          </select>
          <button className="btn btn-outline-secondary" onClick={refetch}>重新整理</button>
          <button className="btn btn-primary shadow-sm" onClick={() => navigate('/admin/work-items/new')}>+ 新增待辦</button>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body p-0">
          <div className="table-responsive d-none d-md-block">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="text-center ps-4" style={{ width: '80px' }}>編號</th>
                  <th scope="col">標題</th>
                  <th scope="col" className="text-center" style={{ width: '120px' }}>狀態</th>
                  <th scope="col" className="text-center" style={{ width: '160px' }}>操作</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {workItems.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">目前無任何項目</td>
                  </tr>
                ) : (
                  workItems.map((item, index) => {
                    const currentId = getItemId(item);
                    return (
                      <tr 
                        key={currentId}
                        onClick={() => navigate(`/admin/work-items/${currentId}/edit`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td className="text-center text-muted fw-medium ps-4">{index + 1}</td>
                        <td className="fw-medium">{item.title || item.Title || '無標題'}</td>
                        <td className="text-center">
                          {item.status === 'Confirmed' ? (
                            <span className="badge bg-success">已確認</span>
                          ) : item.status === 'Pending' ? (
                            <span className="badge bg-warning text-dark">待處理</span>
                          ) : (
                            <span className="badge bg-secondary">{item.status || '未知'}</span>
                          )}
                        </td>
                        <td className="text-center text-nowrap" onClick={(e) => e.stopPropagation()}>
                          <button 
                            className="btn btn-sm btn-outline-secondary me-2" 
                            onClick={() => navigate(`/admin/work-items/${currentId}/edit`)}
                          >
                            編輯
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => handleDelete(currentId)}
                          >
                            刪除
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Mobile Card View */}
          <div className="d-block d-md-none">
            {workItems.length === 0 ? (
              <div className="text-center py-5 text-muted">目前無任何項目</div>
            ) : (
              <ul className="list-group list-group-flush">
                {workItems.map((item, index) => {
                  const currentId = getItemId(item);
                  return (
                    <li key={currentId} className="list-group-item p-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted fw-medium">#{index + 1}</span>
                        {item.status === 'Confirmed' ? (
                          <span className="badge bg-success">已確認</span>
                        ) : item.status === 'Pending' ? (
                          <span className="badge bg-warning text-dark">待處理</span>
                        ) : (
                          <span className="badge bg-secondary">{item.status || '未知'}</span>
                        )}
                      </div>
                      <div className="fw-medium mb-3">{item.title || item.Title || '無標題'}</div>
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => navigate(`/admin/work-items/${currentId}/edit`)}
                        >
                          編輯
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(currentId)}
                        >
                          刪除
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWorkItemList;