import axios from 'axios';
import { CronJob } from 'cron';
import process from 'process';

import { ResponseBitcoin } from '../interfaces/response-bitcoin';
import { TwitterService } from '../services/twitterService';
import { formatCurrency, formatCurrencyDollar, formatDate } from '../utils/format';

const appKey = process.env.API_KEY_CONSUMER_BITCOIN;
const appSecret = process.env.API_KEY_SECRET_CONSUMER_BITCOIN;
const accessToken = process.env.ACESS_TOKEN_BITCOIN;
const accessSecret = process.env.ACESS_TOKEN_SECRET_BITCOIN;

const tw = new TwitterService();

const urlApi = 'https://blockchain.info/ticker';

const job = new CronJob(
  '0 */30 * * * *',
  async () => {
    axios.get(urlApi).then(res => {
      const dados: ResponseBitcoin = res.data;
      if (process.env.NODE_ENV === 'prod') {
        tw.sendTweet(
          `BR: O Bitcoin está cotado em ${formatCurrency(dados.BRL.last)}!
US: Bitcoin is quoted at ${formatCurrencyDollar(dados.USD.last)}!
(${formatDate(new Date(), 'DD/MM/YYYY HH:mm')}) #bitcoin #coin #btc`,
          appKey,
          appSecret,
          accessToken,
          accessSecret,
          'bitcoin',
          `${formatCurrency(dados.BRL.last)}   ${formatCurrencyDollar(dados.USD.last)}`
        );
      } else {
        console.log(`BR: O Bitcoin está cotado em ${formatCurrency(dados.BRL.last)}!
US: Bitcoin is quoted at ${formatCurrencyDollar(dados.USD.last)}!
(${formatDate(new Date(), 'DD/MM/YYYY HH:mm')}) #bitcoin #coin #btc`);
      }
    });
  },
  () => console.log('Stop'),
  undefined,
  'America/Sao_Paulo'
);

export default job;
