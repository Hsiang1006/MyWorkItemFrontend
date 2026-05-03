import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useGetWorkItemsQuery,
  useBatchConfirmMutation,
  useRevokeWorkItemMutation,
} from "../../features/workItem/workItemApi";

const WorkItemList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const sortOrder = searchParams.get("sort") || "latest"; // 'latest' = 最新, 'oldest' = 最舊

  const {
    data: workItems = [],
    isLoading,
    isError,
    refetch,
  } = useGetWorkItemsQuery(sortOrder);
  const [batchConfirm, { isLoading: isConfirming }] = useBatchConfirmMutation();
  const [revokeItem] = useRevokeWorkItemMutation();

  const [selectedIds, setSelectedIds] = useState([]);

  // 取得真實的 ID (防範 .NET 大小寫序列化問題)
  const getItemId = (item) => item.id || item.Id || item.workItemId;

  // 過濾出可選取的項目 (尚未確認的項目)
  const selectableItems = useMemo(() => {
    return workItems.filter((item) => item.status !== "Confirmed");
  }, [workItems]);

  const handleSortChange = (e) => {
    setSearchParams({ sort: e.target.value });
  };

  // 全選/取消全選邏輯 (只針對可選項目)
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allSelectableIds = selectableItems.map((item) => getItemId(item));
      setSelectedIds(allSelectableIds);
    } else {
      setSelectedIds([]);
    }
  };

  // 單選/取消單選邏輯
  const handleSelect = (e, id) => {
    e.stopPropagation(); // 避免觸發列點擊事件
    if (!id) {
      console.error("無法選取：找不到項目的 ID", id);
      return;
    }
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  // 批次確認處理
  const handleBatchConfirm = async () => {
    if (selectedIds.length === 0) {
      alert("請先選擇要確認的項目");
      return;
    }
    if (window.confirm(`確定要確認選取的 ${selectedIds.length} 筆項目嗎？`)) {
      try {
        await batchConfirm(selectedIds).unwrap();
        alert("批次確認成功！");
        setSelectedIds([]);
      } catch (err) {
        alert("批次確認失敗: " + (err.data?.message || "發生錯誤"));
      }
    }
  };

  // 撤銷處理
  const handleRevoke = async (e, id) => {
    e.stopPropagation(); // 避免觸發列點擊事件
    if (!id) {
      alert("無效的項目 ID");
      return;
    }
    if (window.confirm('確定要將此項目標記回『待確認』嗎？')) {
      try {
        await revokeItem(id).unwrap();
        alert("撤銷成功！");
        setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
      } catch (err) {
        alert("撤銷失敗: " + (err.data?.message || "發生錯誤"));
      }
    }
  };

  const goToDetail = (id) => {
    if (!id) {
      alert("無效的項目 ID，無法進入詳情");
      return;
    }
    navigate(`/work-items/${id}?${searchParams.toString()}`);
  };

  if (isLoading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  if (isError)
    return (
      <div className="alert alert-danger mt-3">
        載入列表失敗，請稍後再試或確認您的權限。
      </div>
    );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h4 className="fw-bold mb-0 text-primary">待辦事項列表</h4>
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
          <button
            className="btn btn-primary shadow-sm"
            onClick={handleBatchConfirm}
            disabled={selectedIds.length === 0 || isConfirming}
          >
            {isConfirming ? (
              <span className="spinner-border spinner-border-sm me-1" />
            ) : null}
            批次確認 ({selectedIds.length})
          </button>
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="d-none d-md-block table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="text-center" style={{ width: "60px" }}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={
                        selectableItems.length > 0 &&
                        selectedIds.length === selectableItems.length
                      }
                      onChange={handleSelectAll}
                      disabled={selectableItems.length === 0}
                    />
                  </th>
                  <th scope="col" className="text-center" style={{ width: "80px" }}>編號</th>
                  <th scope="col">標題</th>
                  <th scope="col" className="text-center" style={{ width: "100px" }}>狀態</th>
                  <th scope="col" className="text-center" style={{ width: "160px" }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {workItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      目前無待辦項目
                    </td>
                  </tr>
                ) : (
                  workItems.map((item, index) => {
                    const currentId = getItemId(item);
                    const isConfirmed = item.status === "Confirmed";

                    return (
                                          <tr
                                            key={currentId || index}
                                            onClick={() => goToDetail(currentId)}
                                            style={{ cursor: "pointer" }}
                                            className={selectedIds.includes(currentId) ? 'table-primary' : ''}
                                          >                        <td className="text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedIds.includes(currentId)}
                            onChange={(e) => handleSelect(e, currentId)}
                            disabled={isConfirmed}
                          />
                        </td>
                        <td className="text-center">{index + 1}</td>
                        <td className="fw-medium">
                          {item.title || item.Title || "無標題"}
                        </td>
                        <td className="text-center">
                          {isConfirmed ? (
                            <span className="badge bg-success">已確認</span>
                          ) : item.status === "Pending" ? (
                            <span className="badge bg-warning text-dark">待確認</span>
                          ) : (
                            <span className="badge bg-secondary">{item.status || "未知"}</span>
                          )}
                        </td>
                        <td className="text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="d-flex gap-2 justify-content-center">
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => goToDetail(currentId)}
                            >
                              詳情
                            </button>
                            {isConfirmed && (
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={(e) => handleRevoke(e, currentId)}
                              >
                                撤銷
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="d-block d-md-none">
            {selectableItems.length > 0 && (
              <div className="p-3 border-bottom bg-light d-flex align-items-center">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  checked={selectedIds.length === selectableItems.length}
                  onChange={handleSelectAll}
                />
                <span className="text-muted fw-medium" style={{ fontSize: "14px" }}>全選</span>
              </div>
            )}
            
            {workItems.length === 0 ? (
              <div className="text-center py-5 text-muted">目前無待辦項目</div>
            ) : (
              <ul className="list-group list-group-flush">
                {workItems.map((item, index) => {
                  const currentId = getItemId(item);
                  const isConfirmed = item.status === "Confirmed";

                  return (
                    <li 
                      key={currentId || index} 
                      className="list-group-item p-3"
                      onClick={() => goToDetail(currentId)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex w-100 justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <div onClick={(e) => e.stopPropagation()}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={selectedIds.includes(currentId)}
                              onChange={(e) => handleSelect(e, currentId)}
                              disabled={isConfirmed}
                            />
                          </div>
                          <span className="text-muted small">#{index + 1}</span>
                        </div>
                        <div>
                          {isConfirmed ? (
                            <span className="badge bg-success">已確認</span>
                          ) : item.status === "Pending" ? (
                            <span className="badge bg-warning text-dark">待確認</span>
                          ) : (
                            <span className="badge bg-secondary">{item.status || "未知"}</span>
                          )}
                        </div>
                      </div>
                      <div className="fw-medium mb-3 ms-4 ps-1">
                        {item.title || item.Title || "無標題"}
                      </div>
                      <div className="d-flex justify-content-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => goToDetail(currentId)}
                        >
                          詳情
                        </button>
                        {isConfirmed && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={(e) => handleRevoke(e, currentId)}
                          >
                            撤銷
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkItemList;