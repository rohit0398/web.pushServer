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

const scriptStr = `<script>(function () {
  var o = document.getElementById("pushNotificationButton");
  o ? o.addEventListener("click", function () {
    "Notification" in window && navigator.serviceWorker && Notification.requestPermission().then(function (o) {
      if ("granted" === o) {
        var _o = {
          title: "UPDATE_TITLE",
          body: "UPDATE_BODY"
        };
        new Notification(_o.title, _o), fetch("UPDATE_POSTBACK_URL", {
          headers: {
            Authorization: "UPDATE_TOKEN",
            "Custom-Header": "UPDATE_CUSTOM_VALUE"
          }
        })["catch"](function (o) {
          console.error("Fetch error:", o);
        }), window.location.href = "UPDATE_SUCCESS_URL";
      } else "denied" === o && (window.location.href = "UPDATE_DENIED_URL");
    });
  }) : console.log("notification button not found");
})();</script>`;

type IupdateScriptString = {
  UPDATE_TITLE: string;
  UPDATE_BODY?: string;
  UPDATE_POSTBACK_URL: string;
  UPDATE_TOKEN?: string;
  UPDATE_CUSTOM_VALUE?: string;
  UPDATE_SUCCESS_URL?: string;
  UPDATE_DENIED_URL?: string;
};
export function updateScriptString(obj: IupdateScriptString) {
  const updatingKeys = {
    UPDATE_BODY: '',
    UPDATE_TOKEN: '',
    UPDATE_CUSTOM_VALUE: '',
    UPDATE_SUCCESS_URL: '',
    UPDATE_DENIED_URL: '',
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
