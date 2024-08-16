/*  eslint-disable @typescript-eslint/no-explicit-any */
import React, { JSX } from 'react';

export const formatErrors = (error: any): string | JSX.Element => {
  if (error.message) {
    return error.message;
  }

  const { errors } = error;
  const errorList = Object.values(errors);
  if (errorList.length === 1) {
    return errorList[0] as string;
  }

  return (
    <ul>
      {errorList.map((errorItem, index) => (
        <li key={index}>{errorItem as string}</li>
      ))}
    </ul>
  );
};
