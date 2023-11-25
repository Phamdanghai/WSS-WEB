import { ThemeConfig } from 'antd'

const theme: ThemeConfig = {
  components: {
    Button: {
      colorPrimary: '#DF6951',
      colorPrimaryActive: '#DF6951',
      colorPrimaryHover: '#DF6951',
      colorBgContainer: 'white',
      colorBorder: '#DF6951',
      colorText: '#DF6951',
      defaultGhostBorderColor: '#DF6951',
      ghostBg: 'rgba(223, 105, 81, 0.20)',
      defaultGhostColor: '#DF6951'
    },
    Checkbox: {
      colorPrimary: '#3E334E',
      colorPrimaryBorder: '#3E334E',
      colorPrimaryHover: '#3E334E'
    },
    Slider: {
      handleColor: '#7D7D7D',
      handleActiveColor: '#000',
      trackBg: '#7D7D7D',
      trackHoverBg: '#000',
      dotActiveBorderColor: '#000',
      colorPrimary: '#000',
      colorPrimaryBorder: '#000',
      colorPrimaryBorderHover: '#000'
    },
    Steps: {
      colorPrimary: '#DF6951',
      colorSplit: '#FFE7D6'
    }
  }
}

export default theme
