declare module '@microsoft/clarity' {
  /**
   * Microsoft Clarity API for tracking user behavior and analytics
   */
  const Clarity: {
    /**
     * Initialize Microsoft Clarity with your project ID
     * @param projectId - Your Clarity project ID
     */
    init(projectId: string): void;

    /**
     * Set a custom tag for the session
     * @param key - The tag key
     * @param value - The tag value(s)
     */
    setTag(key: string, value: string | string[]): void;

    /**
     * Identify a user with custom identifiers
     * @param customerId - The unique customer identifier (required)
     * @param customSessionId - Custom session identifier (optional)
     * @param customPageId - Custom page identifier (optional)
     * @param friendlyName - A friendly name for the customer (optional)
     */
    identify(
      customerId: string,
      customSessionId?: string,
      customPageId?: string,
      friendlyName?: string
    ): void;

    /**
     * Set cookie consent status
     * @param consent - Whether the user has given consent (default: true)
     */
    consent(consent?: boolean): void;

    /**
     * Upgrade the current session for priority recording
     * @param reason - The reason for upgrading the session
     */
    upgrade(reason: string): void;

    /**
     * Track a custom event
     * @param eventName - The name of the event to track
     */
    event(eventName: string): void;
  };

  export default Clarity;
}
