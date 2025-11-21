export function TemplateReplacerForCusrtomColumns(template, data) {
  const normalize = (s) => s?.trim()?.toLowerCase();

  return template?.replace(/\[\[\[(HDPCC\d+)\.(.*?)\]\]\]/g, (match, backend, frontend) => {
    let backKey = Object.keys(data)?.find(k => normalize(k) === normalize(backend));
    if (backKey) return data[backKey] ?? "";

    let frontKey = Object.keys(data)?.find(k => normalize(k) === normalize(frontend));
    if (frontKey) return data[frontKey] ?? "";

    return "";
  });
};


export function encodeEmailData(formattedEmailArray) {
  const encoder = new TextEncoder();

  const base64Encode = (str) => {
    return btoa(String.fromCharCode(...encoder.encode(str)));
  };

  return Object.keys(formattedEmailArray).reduce((acc, key) => {
    const skipKeys = [
      "emailUniqueId",
      "TeamCode",
      "conversationId",
      "mtrk",
      "siteName",
      "tenantName",
    ];

    const value = formattedEmailArray[key];

    if (value && !skipKeys.includes(key)) {
      acc[key] = base64Encode(value);
    } else {
      acc[key] = value;
    }

    return acc;
  }, {});
}

export function replaceAnchorTags(
    body,
    trackingApiUrl,
    uniqueId,
    AllEmailData,
    alldata
  ) {
    FormattedDataForLink = [];
    AllLinks = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(body, "text/html");
    const anchorTags = doc.querySelectorAll("a");
    anchorTags.forEach((anchor) => {
      const UniqueLinkID = generateGUID();
      const LinkURL = anchor.href;
      const linkText = anchor.textContent || anchor.title || anchor.href;
      AllLinks.push(LinkURL);
      const newAnchorHtml = `<a href="${trackingApiUrl}/api/v1/redirect?link=${LinkURL}&uniqueId=${uniqueId}&senderId=${AllEmailData?.ByWho}&uniqueLinkId=${UniqueLinkID}">${linkText}</a>`;
      const wrapper = document.createElement("div");
      FormattedDataForLink.push({
        Title: UniqueLinkID,
        toWho: alldata?.ToWho,
        byWho: alldata?.ByWho,
        EmailUniqueID: uniqueId,
        Url: LinkURL,
        FirstClick: "",
        LastClick: "",
        TotalClicks: "0",
        Subject: alldata?.Subject,
        UniqueLinkID: UniqueLinkID,
      });
      wrapper.innerHTML = newAnchorHtml;
      anchor.replaceWith(wrapper.firstChild);
    });
    return doc.body.innerHTML;
  }