const formatDate = (date) => {
  if(!date) {
      return null;
  }
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${date.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
}

export default formatDate
