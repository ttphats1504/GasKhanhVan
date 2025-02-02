import axiosClient from './axiosClient';

const handleAPI = async (
  url: string,
  method: 'get' | 'post' | 'put' | 'delete',
  data?: any,
  headers?: Record<string, string>
) => {
  try {
    const response = await axiosClient(url, {
		method, // HTTP method (GET, POST, etc.)
		...(method === 'get' ? { params: data } : { data }), // Handles GET vs other requests
		headers, // Custom headers (optional)
	  });

    return response;
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export default handleAPI;
