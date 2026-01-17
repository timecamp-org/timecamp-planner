function routeToCollections(doc) {
  if (doc.channels && (doc.channels instanceof Array)) { 
    return doc.channels;
  } else {
    return [];
  }
}

module.exports = routeToCollections;