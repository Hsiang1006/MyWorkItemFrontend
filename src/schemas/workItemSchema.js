import { z } from 'zod';

export const workItemSchema = z.object({
  title: z.string().min(1, '標題不可為空').max(100, '標題長度不能超過 100 字'),
  description: z.string().max(500, '描述長度不能超過 500 字').optional(),
});
