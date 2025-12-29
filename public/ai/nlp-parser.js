export function parseSentence(text) {
  const nums = text.match(/\d+(\.\d+)?/g)?.map(Number) || [];
  if (/مساحت|area/i.test(text)) {
    return { type:'area', width:nums[0], height:nums[1] };
  }
  return { type:'unknown' };
}
