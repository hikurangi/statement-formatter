import { KiwibankCSVRow } from '../assets/types';

const getPayee = (row: KiwibankCSVRow): string => {
  let payee = [];

  if (row['OP name']) {
    payee.push(row['OP name']);
  }

  if (row['OP Bank Account Number']) {
    payee.push(row['OP Bank Account Number']);
  }

  return payee.join(' ; '); // join on an empty array results in an empty string?
};

const getReference = (row: KiwibankCSVRow): string => "" // {
  // let payee = [];

  // if (row['OP name']) {
  //   payee.push(row['OP name']);
  // }

  // if (row['OP Bank Account Number']) {
  //   payee.push(row['OP Bank Account Number']);
  // }

  // return payee.join(' ; '); // join on an empty array results in an empty string?
//};

export {
  getPayee,
  getReference
}