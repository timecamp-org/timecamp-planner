import React from 'react'
import { connect } from 'react-redux'
import { Platform, StyleSheet, Text, View, Button } from 'react-native'

import { selectFilesData } from 'models/domain/FilesModel/selectors'
import { onQueueFilesAndStartUploading } from 'models/domain/FilesModel/actions'

class ConnectedComponent extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
  }

  render() {
    return (
      <View>
        <Text style={styles.instructions}>{this.props.alertIds.toJS().toString()}</Text>
        <Button title="asdasd" onPress={() => {
          this.props.onQueueFilesAndStartUploading({
            lastModified: 1536053284260,
            name: "asda",
            size: 0,
            type: "",
            webkitRelativePath: "",
          })
        }}></Button>
      </View>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    alertIds: selectFilesData(state),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onQueueFilesAndStartUploading: (file) => dispatch(onQueueFilesAndStartUploading([file])),
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedComponent)
