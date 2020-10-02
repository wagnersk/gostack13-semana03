const formatValue = (value: number): string =>
  Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'BRL' }).format(
    value,
  ); // TODO

export default formatValue;
