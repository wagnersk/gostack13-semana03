const formatDate = (value: Date): string => {
  // converto para string
  const dateInString = value.toString();
  // retiro o que não presta
  const onlyDateInfo = dateInString.slice(0, 10);
  // converto para data
  const convertBackStringToDate = new Date(onlyDateInfo);
  const justDateInfoInDate = Intl.DateTimeFormat().format(
    convertBackStringToDate,
  );
  // retorno isso

  return justDateInfoInDate;
};

export default formatDate;
