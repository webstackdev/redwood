import { MakeServices } from './types'

/**
 * This function is a stub for when we fully introduce the concept of
 * services.
 */
export const makeServices: MakeServices = ({ services }) => {
  const secureServices: any = {}

  for (const [serviceName, service] of Object.entries(services)) {
    secureServices[serviceName] = {}

    for (const [funcName, func] of Object.entries(service)) {
      if (funcName !== 'before') {
        secureServices[serviceName][funcName] = (...args: Array<unknown>) => {
          if (service.before) {
            const beforeResult = service.before({ serviceName: funcName })
            if (beforeResult || beforeResult === undefined) {
              return func(...args)
            } else {
              throw new Error('Service aborted')
            }
          } else {
            return func(...args)
          }
        }
      }
    }
  }

  return secureServices
}
