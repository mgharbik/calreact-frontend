import moment from 'moment'

export const formatDate = function(date) {
  return date ? moment(date).format('MMMM DD YYYY, h:mm:ss a') : '';
};
