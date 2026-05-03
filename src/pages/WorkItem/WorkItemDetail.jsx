import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  useGetWorkItemQuery, 
  useBatchConfirmMutation, 
  useRevokeWorkItemMutation 
} from '../../features/workItem/workItemApi';

const WorkItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { data: item, isLoading, isError } = useGetWorkItemQuery(id);
  const [batchConfirm, { isLoading: isConfirming }] = useBatchConfirmMutation();
  const [revokeItem] = useRevokeWorkItemMutation();

  const formatDateTime = (utcDateString) => {
    if (!utcDateString) return '無';
    const date = new Date(utcDateString);
    if (isNaN(date.getTime())) return '無效時間';
    return new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  };

  const handleBack = () => {
    navigate(`/work-items?${searchParams.toString()}`);
  };

  const currentId = item?.id || item?.Id || item?.workItemId || id;

  const handleConfirm = async () => {
    if (window.confirm('確定要確認此項目嗎？')) {
      try {
        await batchConfirm([currentId]).unwrap();
        alert('確認成功！');
      } catch (err) {
        alert('確認失敗: ' + (err.data?.message || '發生錯誤'));
      }
    }
  };

  const handleRevoke = async () => {
    if (window.confirm('確定要撤銷此項目嗎？')) {
      try {
        await revokeItem(currentId).unwrap();
        alert('撤銷成功！');
      } catch (err) {
        alert('撤銷失敗: ' + (err.data?.message || '發生錯誤'));
      }
    }
  };

  if (isLoading) return <div className="text-center mt-5"><div className="spinner-border text-primary" /></div>;
  if (isError || !item) return <div className="alert alert-danger mt-3">載入詳情失敗，找不到該項目。</div>;

  const isConfirmed = item.status === 'Confirmed';

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h5 className="mb-0 fw-bold">待辦項目詳情</h5>
        <div className="d-flex gap-2">
          {!isConfirmed ? (
            <button 
              className="btn btn-primary btn-sm" 
              onClick={handleConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? <span className="spinner-border spinner-border-sm me-1" /> : null}
              確認
            </button>
          ) : (
            <button 
              className="btn btn-outline-danger btn-sm" 
              onClick={handleRevoke}
            >
              撤銷
            </button>
          )}
          <button className="btn btn-outline-secondary btn-sm" onClick={handleBack}>
            返回列表
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-sm-3 fw-bold text-muted">標題</div>
          <div className="col-sm-9">{item.title || item.Title || '無標題'}</div>
        </div>
        <hr className="my-2" />
        <div className="row mb-3">
          <div className="col-sm-3 fw-bold text-muted">描述</div>
          <div className="col-sm-9" style={{ whiteSpace: 'pre-wrap' }}>
            {item.description || item.Description || '無描述'}
          </div>
        </div>
        <hr className="my-2" />
        <div className="row mb-3">
          <div className="col-sm-3 fw-bold text-muted">狀態</div>
          <div className="col-sm-9">
            {isConfirmed ? (
              <span className="badge bg-success">已確認</span>
            ) : item.status === 'Pending' ? (
              <span className="badge bg-warning text-dark">待處理</span>
            ) : (
              <span className="badge bg-secondary">{item.status || '未知'}</span>
            )}
          </div>
        </div>
        <hr className="my-2" />
        <div className="row mb-3">
          <div className="col-sm-3 fw-bold text-muted">建立時間</div>
          <div className="col-sm-9">{formatDateTime(item.createdAt || item.date || item.CreatedAt || item.Date)}</div>
        </div>
        <hr className="my-2" />
        <div className="row mb-3">
          <div className="col-sm-3 fw-bold text-muted">最後更新時間</div>
          <div className="col-sm-9">{formatDateTime(item.updatedAt || item.UpdatedAt)}</div>
        </div>
      </div>
    </div>
  );
};

export default WorkItemDetail;
