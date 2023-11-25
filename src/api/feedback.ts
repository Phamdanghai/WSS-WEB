import { apiV3 } from '.'

export const getFeedbackByServiceId = async ({ id }: { id: string }) => apiV3.get('/Feedback/group/?serviceId=' + id)
export const createFeedback = async ({
  content,
  rating,
  orderDetailId
}: {
  content: string
  rating: number
  orderDetailId: string
}) => {
  apiV3.post('/Feedback', {
    content,
    rating,
    orderDetailId
  })
}
