import axios from 'axios';

export async function getClientTenetBaseURL(tanent: string) {
  try {
    let res = await axios.request({
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://dd8e7419454a43dd85d3e588a595e6.ea.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/abd0fd21d1e74a0d8799f663183f9199/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zVKGC2sjSL98_5xbSad2jbrXRe-wt5ktS3k9GEyW8as',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        userTenant: tanent
      })
    });
    let tanetSiteUrl = '';
    const tenantName = res?.data?.d?.results[0]?.NewTenant;

    const siteUrlWorkbench = tenantName?.indexOf('workbench');
    const siteUrlTeamsHostedApp = tenantName?.indexOf('teamshostedapp');

    if (siteUrlWorkbench === -1 || siteUrlTeamsHostedApp === -1) {
      const url = tenantName?.split('/_layout')[0];
      tanetSiteUrl = url ? url : tenantName;
    } else {
      tanetSiteUrl = tenantName;
    }
    return tanetSiteUrl;
    
  } catch (error) {
    console.log("Error in getClientTenetBaseURL:", error);
  }
}
