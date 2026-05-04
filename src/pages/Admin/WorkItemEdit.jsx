import { useParams, useNavigate } from 'react-router-dom';
import { useGetAdminWorkItemQuery, useUpdateWorkItemMutation } from '../../features/workItem/workItemApi';
import WorkItemForm from './WorkItemForm';

const WorkItemEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: item, isLoading: isFetching, isError } = useGetAdminWorkItemQuery(id);
  const [updateItem, { isLoading: isUpdating }] = useUpdateWorkItemMutation();

  const onSubmit = async (data) => {
    try {
      await updateItem({ id, ...data }).unwrap();
      alert('修改成功！');
      navigate('/admin/work-items');
    } catch (err) {
      alert('修改失敗: ' + (err.data?.message || '發生錯誤'));
    }
  };
  
  if (isFetching) return <div className="text-center mt-5"><div className="spinner-border text-primary" /></div>;
  if (isError) return <div className="alert alert-danger mt-3">無法載入項目資料。</div>;

  const defaultValues = {
    title: item?.title || item?.Title || '',
    description: item?.description || item?.Description || ''
  };

  return (
    <WorkItemForm 
      onFormSubmit={onSubmit} 
      isLoading={isUpdating}
      isEditMode={true}
      defaultValues={defaultValues}
    />
  );
};

export default WorkItemEdit;
