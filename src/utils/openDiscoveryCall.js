export const openDiscoveryCall = () => {
  window.dispatchEvent(new CustomEvent("beyondnull:open-discovery-call"));
};
