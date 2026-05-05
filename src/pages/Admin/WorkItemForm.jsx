import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workItemSchema } from '../../schemas/workItemSchema';
import { useNavigate } from 'react-router-dom';

const WorkItemForm = ({ defaultValues, onFormSubmit, isLoading, isEditMode = false }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(workItemSchema),
    defaultValues: defaultValues,
  });

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0 fw-bold">{isEditMode ? '編輯待辦項目' : '新增待辦項目'}</h5>
      </div>
      <div className="card-body p-4">
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="mb-3">
            <label className="form-label fw-medium">標題 <span className="text-danger">*</span></label>
            <input
              type="text"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              placeholder="請輸入標題"
              {...register('title')}
            />
            <div className="invalid-feedback">{errors.title?.message}</div>
          </div>
          <div className="mb-4">
            <label className="form-label fw-medium">描述</label>
            <textarea
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              rows="5"
              placeholder="請輸入詳細描述 (選填)"
              {...register('description')}
            ></textarea>
            <div className="invalid-feedback">{errors.description?.message}</div>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-light" onClick={() => navigate('/admin/work-items')}>
              取消
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading}
            >
              {isLoading ? '儲存中...' : '儲存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkItemForm;
