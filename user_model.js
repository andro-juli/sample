/**
 * User Model
 * wrapper around backend provided User Object
 */
export class UserModel {
  _remoteUser;
  routes = {
    selfie_verification: "/auth/signup/liveliness-check",
    signup_init: "/auth/signup/",
    set_transaction_pin: "/auth/signup/set-transaction-pin",
    id_verification: "/auth/identity-verification/link-id",
    link_bvn: "/auth/link-bvn",
  };
  checks = [
    { key: "is_created_password", route: this.routes.signup_init },
    { key: "is_created_pin", route: this.routes.set_transaction_pin },
    { key: "is_completed_kyc", route: this.routes.selfie_verification },
    { key: "is_uploaded_selfie_image", route: this.routes.selfie_verification },
    { key: "is_verified_bvn", route: this.routes.link_bvn },
    { key: "is_uploaded_identity_card", route: this.routes.id_verification },
  ];

  /**
   * Takes remote user object and sets it as a "private" variable
   * @constructor
   */
  constructor(remoteUser) {
    this._remoteUser = remoteUser;
  }

  get details() {
    return { ...this._remoteUser };
  }

  /**
   * check if user has completed all necessary fields for onboarding
   */
  get hasCompletedSignup() {
    if (!this._remoteUser) return false;
    const getKey = (item) => item.key;
    const keys = this.checks.map(getKey);
    return keys.map((key) => this.details[key]).every(Boolean);
  }

  /**
   * get the path to current in onboarding process
   * @returns {string | null} route - path to stage
   */
  getCurrentStageRoute() {
    for (const check of this.checks) {
      const { key, route } = check;
      if (!this.details[key]) return route;
    }
    return null;
  }
}
