/**
 * Returns an encoded SoundCloud widget embed URL for a given track ID.
 */
export const getSoundCloudWidgetUrl = (trackId: string | number): string => {
  return `https%3A//api.soundcloud.com/tracks/${trackId}&show_teaser=false&color=%2300a99d&inverse=false&show_user=false&sharing=false&buying=false&liking=false&show_artwork=false&show_name=false`;
};
