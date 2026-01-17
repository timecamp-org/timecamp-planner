type NativeSelection = {
  start: number,
  end: number,
}

const calculateSelection = (newDescription: string, oldDescription: string, selection: NativeSelection): NativeSelection => {
  const descriptionDiff = newDescription.length - oldDescription.length
  if (Math.abs(selection.start - selection.end) > 0) {
    return {
      start: selection.end + descriptionDiff,
      end: selection.end + descriptionDiff,
    }
  } else {
    return {
      start: selection.start + descriptionDiff,
      end: selection.end + descriptionDiff,
    }
  }
}

export default calculateSelection