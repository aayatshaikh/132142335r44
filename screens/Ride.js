getCameraPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({
        /*status === "granted" is true when user has granted permission
            status === "granted" is false when user has not granted the permission
          */
        hasCameraPermissions: status === "granted",
        domState: "scanner",
        scanned: false
    });
};

handleBarCodeScanned = async ({ type, data }) => {
    this.setState({
        bikeId: data,
        domState: "normal",
        scanned: true
    });
};

handleTransaction = async () => {
    var { bikeId, userId } = this.state;
    await this.getBikeDetails(bikeId);
    await this.getUserDetails(userId);

    var transactionType = await this.checkBikeAvailability(bikeId);

    if (!transactionType) {
        this.setState({ bikeId: "" });
        Alert.alert("Kindly enter/scan valid bike id");
    } else if (transactionType === "under_maintenance") {
        this.setState({
            bikeId: ""
        });
    } else if (transactionType === "rented") {
        // Check user availability for start ride 
        var isEligible = this.checkUserEligibilityForStartRide(userId);

        if (isEligible) {
            var { bikeType, userName } = this.state;
            this.assignBike(bikeId, userId, bikeType, userName);
            Alert.alert(
                "You have rented the bike for next 1 hour. Enjoy your ride!!!"
            );
            this.setState({
                bikeAssigned: true
            });

            // For Android users only
            // ToastAndroid.show(
            //   "You have rented the bike for next 1 hour. Enjoy your ride!!",
            //   ToastAndroid.SHORT
            // );
        }
    } else {
        // Check user availability for end ride 
        var isEligible = this.checkUserEligibilityForEndRide(userId);

        if (isEligible) {
            var { bikeType, userName } = this.state;
            this.returnBike(bikeId, userId, bikeType, userName);
            Alert.alert("We hope you enjoyed your ride");
            this.setState({
                bikeAssigned: false
            });

            // For Android users only
            // ToastAndroid.show(
            //   "We hope you enjoyed your ride",
            //   ToastAndroid.SHORT
            // );
        }
    }
};

getBikeDetails = bikeId => {
    bikeId = bikeId.trim();
    db.collection("bicycles")
        .where("id", "==", bikeId)
        .get()
        .then(snapshot => {
            snapshot.docs.map(doc => {
                this.setState});
