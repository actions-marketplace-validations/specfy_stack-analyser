import { register } from '../../rules';

register({
  tech: 'httpd',
  files: ['httpd.conf'],
  dependencies: [{ type: 'docker', name: /httpd/ }],
});