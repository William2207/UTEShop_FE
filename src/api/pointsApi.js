import axios from './axiosConfig';

const pointsApi = {
  // Admin endpoints
  getCustomersWithPoints: (params = {}) => {
    return axios.get('/admin/points/customers', { params });
  },

  getPointTransactions: (params = {}) => {
    return axios.get('/admin/points/transactions', { params });
  },

  createPointTransaction: (data) => {
    return axios.post('/admin/points/transactions', data);
  },

  getPointsStats: () => {
    return axios.get('/admin/points/stats');
  },

  updatePointsConfig: (data) => {
    return axios.put('/admin/points/config', data);
  },

  // Customer endpoints
  getPointHistory: (params = {}) => {
    return axios.get('/points/history', { params });
  },

  earnPointsFromOrder: (data) => {
    return axios.post('/points/earn', data);
  },

  redeemPoints: (data) => {
    return axios.post('/points/redeem', data);
  },

  getPointsConfig: () => {
    return axios.get('/points/config');
  }
};

export default pointsApi;
