const formatDate = (date) => {
    if (!date) {
        return "";
    }

    const formattedDate = new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    }).format(new Date(date));

    return formattedDate
        .replace("am", "AM")
        .replace("pm", "PM");
};

export default formatDate;