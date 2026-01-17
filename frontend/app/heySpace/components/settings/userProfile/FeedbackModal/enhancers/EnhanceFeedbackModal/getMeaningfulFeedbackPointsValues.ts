export type FeedbackPointValue = {
  isChecked?: boolean,
  additionalFeedback: string,
}

export interface FeedbackPointValues {
  [key: string]: FeedbackPointValue
}

// filter out not checked feedback points to prevent polluting DB with empty data
const getMeaningfulFeedbackPointsValues = (feedbackPointsValues: FeedbackPointValues, additionalFeedback: string): FeedbackPointValues => {
  const meaningfulFeedbackPointValues: FeedbackPointValues = {}
  Object.keys(feedbackPointsValues).forEach(feedbackPointName => {
    const value = feedbackPointsValues[feedbackPointName]
    if (value.isChecked) {
      meaningfulFeedbackPointValues[feedbackPointName] = value
    }
  })

  if (additionalFeedback) {
    meaningfulFeedbackPointValues.additional_feedback = { additionalFeedback }
  }

  return meaningfulFeedbackPointValues
}

export default getMeaningfulFeedbackPointsValues
