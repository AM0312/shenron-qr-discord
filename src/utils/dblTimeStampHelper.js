class DblTimestampHelper {
  static timestampEncoding = [
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "J",
    "K",
    "M",
    "N",
    "P",
    "Q",
    "R",
    "S",
    "T",
  ];

  static createDblTimestamp() {
    let creationDate = Date.now().toString(16);
    let encodedTimestamp = "";

    for (let i = 0; i < creationDate.length; i++) {
      encodedTimestamp +=
        DblTimestampHelper.timestampEncoding[parseInt(creationDate[i], 16)];
    }

    return encodedTimestamp;
  }
}

export default DblTimestampHelper;
