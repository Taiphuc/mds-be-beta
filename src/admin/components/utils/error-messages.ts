export const getErrorMessage = (error: any): string => {
  if (error.response && error.response.data) {
    const { status, data } = error.response;

    if (status === 401) {
      return data?.message || data?.data?.toString() || "Unauthorized access.";
    }

    let msg: string | undefined = typeof data.message === 'string' ? data.message : undefined;

    if (Array.isArray(data.message) && data.message[0]?.message) {
      msg = data.message[0].message;
    }

    return msg || "Something went wrong. Please try again.";
  }

  return error.message || "An unexpected error occurred. Please try again.";
};