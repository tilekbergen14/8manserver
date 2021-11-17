function strToTagsArr(tags) {
  const tagsArr = [];
  let start = null,
    end = null;
  for (let i = 0; i < tags.length; i++) {
    if (tags[i] === "#" && tags[i + 1] !== "#") {
      start = i;
    } else if (tags[i] === " " && start !== null) {
      end = i;
    }
    if (start !== null && end !== null) {
      tagsArr.push(tags.slice(start + 1, end));
      (start = null), (end = null);
    }
  }
  return tagsArr;
}

module.exports = strToTagsArr;
