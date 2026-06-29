export const getEstimatedDelivery = (baseDate = new Date()) => {
  const today = new Date(baseDate);
  const minDays = 3;
  const maxDays = 6;
  
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + minDays);
  
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxDays);
  
  const options = { day: 'numeric', month: 'short' };
  
  return `${minDate.toLocaleDateString('en-GB', options)} – ${maxDate.toLocaleDateString('en-GB', options)}`;
};
