export default function ApiResponse(
  success: boolean,
  status: number,
  message: string,
  data: any
) {
  return {
    success: success,
    status: status,
    message: message,
    data: data,
  };
}
