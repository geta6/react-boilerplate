import React, {PropTypes} from 'react';

const HtmlRootComponent = React.createClass({
  displayName: 'HtmlRootComponent',

  propTypes: {
    state: PropTypes.string.isRequired,
    styles: PropTypes.string.isRequired,
    markup: PropTypes.string.isRequired,
    context: PropTypes.object.isRequired,
  },

  render() {
    return (
      <html lang='ja'>
        <head>
          <meta charSet='utf-8' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <meta name='viewport' content='width=device-width,user-scalable=0,initial-scale=1.0' />
          <style dangerouslySetInnerHTML={{__html: this.props.styles}} />
        </head>
        <body>
          <div id='app' dangerouslySetInnerHTML={{__html: this.props.markup}} />
          <script dangerouslySetInnerHTML={{__html: this.props.state}} />
          <script src='/client.js' defer />
        </body>
      </html>
    );
  },
});

export default HtmlRootComponent;
