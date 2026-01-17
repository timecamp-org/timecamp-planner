import generateCTAButtonHTML from "../partial/generateCTAButtonHTML";

const generateNotificationMail = ({ notificationTitle, notificationContent, notificationCTA }) => ({
  subject: `New notification${notificationTitle ? `: ${notificationTitle}` : ''}`,
  content: `
            <p>${notificationContent}</p>
            ${notificationCTA && notificationCTA.caption && notificationCTA.url
    ? generateCTAButtonHTML({buttonCaption: notificationCTA.caption, buttonUrl: notificationCTA.url})
    : ''
    }
        `
})

export default generateNotificationMail