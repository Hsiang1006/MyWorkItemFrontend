import WorkItemForm from './WorkItemForm';
import { useCreateWorkItemMutation } from '../../features/workItem/workItemApi';
import { useNavigate } from 'react-router-dom';

const WorkItemNew = () => {
  const navigate = useNavigate();
  const [createItem, { isLoading }] = useCreateWorkItemMutation();

  const onSubmit = async (data) => {
    try {
      await createItem(data).unwrap();
      alert('新增成功！');
      navigate('/admin/work-items');
    } catch (err) {
      alert('新增失敗: ' + (err.data?.message || '發生錯誤'));
    }
  };

  return (
    <WorkItemForm 
      onFormSubmit={onSubmit} 
      isLoading={isLoading} 
      defaultValues={{ title: '', description: '' }}
    />
  );
};

export default WorkItemNew;
