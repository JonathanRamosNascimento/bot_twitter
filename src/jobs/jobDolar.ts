import axios from 'axios';
import { CronJob } from 'cron';
import * as process from 'process';

import { ResponseReq } from '../interfaces/response-hg';
import { TwitterService } from '../services/twitterService';
import { formatCurrency, formatDate } from '../utils/format';

const tw = new TwitterService();

const urlApi = 'https://economia.awesomeapi.com.br/last/USD-BRL';

const appKey = process.env.API_KEY_CONSUMER;
const appSecret = process.env.API_KEY_SECRET_CONSUMER;
const accessToken = process.env.ACESS_TOKEN;
const accessSecret = process.env.ACESS_TOKEN_SECRET;

const job = new CronJob(
  '0 */15 9-17 * * 1-5',
  async () => {
    axios.get(urlApi).then(res => {
      const dados: ResponseReq = res.data;

      const message = `O valor do Dólar agora é de ${formatCurrency(
        Number(dados.USDBRL.bid)
      )}, a moeda ${Math.sign(Number(dados.USDBRL.pctChange)) >= 0 ? 'subiu' : 'caiu'} ${
        dados.USDBRL.pctChange
      }% desde o início do dia! (${formatDate(
        new Date(),
        'DD/MM/YYYY HH:mm'
      )}) #dolar #precodolar #valordolar #real #dolarhoje #dollar #usd #brl`;

      if (process.env.NODE_ENV === 'prod') {
        tw.sendTweet(
          message,
          appKey,
          appSecret,
          accessToken,
          accessSecret,
          'dollar',
          `${formatCurrency(Number(dados.USDBRL.bid))}`
        );
      } else {
        console.log(message);
      }
    });
  },
  () => console.log('Stop'),
  undefined,
  'America/Sao_Paulo'
);

export default job;
