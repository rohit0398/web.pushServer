import type { Crop } from 'react-image-crop';

export const emailRegx =
  "^[a-zA-Z0-9.#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";

export const wentWrong = `Something went wrong! Please try again`;

export const ServiceTitlesMap: { [key: string]: string } = {
  startups: '🚀  Startups',
  investors: '📊 Investors',
  deals: '🔥 Top Deals',
};

export function validateEmail(value: string) {
  if (value.length <= 0) {
    return 'Please enter email';
  }
  if (value) {
    const testEmail = new RegExp(emailRegx, 'ig').test(value);
    if (!testEmail) return 'Please enter a valid email';
    return '';
  }
  return '';
}

export function validatePassword(value: string, filedName?: string) {
  const name = filedName ?? 'Password';
  const p = value;
  const errors = [];
  if (p.length <= 0) {
    return `${name} is required field`;
  }

  if (/[a-z]/.test(p) < false) {
    errors.push('lowercase');
    // return `${name} must contain at least one lowercase character.`;
  }
  if (/[A-Z]/.test(p) === false) {
    errors.push('uppercase');
    // return `${name} must contain at least one uppercase character.`;
  }
  if (p.search(/[?=.*?[#?!@$%^&*-]/i) < 0) {
    errors.push('special');
    // return `${name} must contain at least one special character.`;
  }
  if (p.search(/[0-9]/) < 0) {
    errors.push('digit');
    // return `${name} must contain at least one digit.`;
  }

  if (errors.length)
    return `${name} must contain at least one ${errors.join(', ')} character${
      p.length < 8 ? ' and 8 character long.' : '.'
    }`;
  if (p.length < 8) return `${name} should have atleast 8 character.`;

  return '';
}

export function validateRequiredField(value: string, filedName?: string) {
  if (value && value.length <= 0) return `${filedName} is required field`;

  return '';
}

export function queryString(obj: { [key: string]: any }) {
  if (typeof obj === 'object') {
    let query = '';
    for (const key of Object.keys(obj)) {
      query += `${key}=${obj[key]}&`;
    }
    return query;
  }
  return '';
}

export function getCroppedCanvas(
  image: HTMLImageElement,
  crop: Crop,
  mimeType: string,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelCrop = {
      x: crop.x * scaleX,
      y: crop.y * scaleY,
      width: crop.width * scaleX,
      height: crop.height * scaleY,
    };

    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve(null);
      return;
    }

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    canvas.toBlob((blob) => {
      resolve(blob);
    }, mimeType);
  });
}

const scriptStr = `<script>
const feedId = "UPDATE_FEEDID";
const successUrl = "UPDATE_SUCCESS_URL"
const updateDeniedUrl = "UPDATE_DENIED_URL"
</script>
<script src=${process?.env?.NEXT_PUBLIC_API_URL}/api/v1/script/push-notification-script.js >
</script>`;

type IupdateScriptString = {
  UPDATE_SUCCESS_URL?: string;
  UPDATE_DENIED_URL?: string;
  UPDATE_FEEDID?: string;
};
export function updateScriptString(obj: IupdateScriptString) {
  const updatingKeys = {
    UPDATE_SUCCESS_URL: '',
    UPDATE_DENIED_URL: '',
    UPDATE_FEEDID: '',
    ...obj,
  };
  const regexPattern = new RegExp(
    `\\b(?:${Object.keys(updatingKeys).join('|')})\\b`,
    'gi',
  );
  const str = scriptStr.replace(regexPattern, (matched) => {
    return updatingKeys[matched as keyof IupdateScriptString];
  });

  return str;
}

export function convertOptionsToValues(
  arr: {
    [key: string]: string;
  }[],
) {
  if (Array.isArray(arr)) {
    return arr.map((val) => val?.value ?? '');
  }
  return [];
}

export function convertValuesToOptions(arr: string[]) {
  if (Array.isArray(arr)) {
    return arr.map((val) => {
      return { label: splitCamelCase(val), value: val ?? '' };
    });
  }
  return [];
}

export function convertValuesToOptionsDaysHours(arr: string[], str?: 'hours') {
  if (Array.isArray(arr) && arr.length) {
    const obj: any = {};
    for (const val of arr) {
      obj[val] = true;
    }
    return obj;
  }
  if (str === 'hours') return resetDaysHours('hours');
  return resetDaysHours();
}

export function splitCamelCase(keyword: string) {
  return keyword && typeof keyword === 'string'
    ? keyword.replace(/([a-z])([A-Z])/g, '$1 $2')
    : '';
}

export function resetDaysHours(str?: 'hours') {
  if (str === 'hours')
    return [...Array(24)].reduce((acc, _, index) => {
      acc[index] = true;
      return acc;
    }, {});
  return {
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: true,
    Sunday: true,
  };
}
