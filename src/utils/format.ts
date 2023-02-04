import dayjs from 'dayjs';

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);

export const formatCurrencyDollar = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);

export const formatPercent = (value: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  }).format(value);

export const formatDate = (date: Date, format = 'DD/MM/YYYY HH:mm:ss'): string =>
  dayjs(date).format(format);
