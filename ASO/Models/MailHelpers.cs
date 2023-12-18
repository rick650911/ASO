using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net.Mail;

namespace ASO.Models {
    public static class MailHelpers {
        public static string SendMail ( MailAddressCollection toaddr, MailAddressCollection ccaddr, MailAddressCollection bccaddr, string subject, string mailbody ) {
            SmtpClient smtpClient = new SmtpClient();
            MailMessage message = new MailMessage();
            try {
                MailAddress fromAddress = new MailAddress(ConfigurationManager.AppSettings["From_Mail"].ToString(), "航照判釋知識教育推廣平台");
                MailAddressCollection mailAddresses = new MailAddressCollection();

                smtpClient.Host = ConfigurationManager.AppSettings["Mail_Host"].ToString();
                smtpClient.Port = int.Parse(ConfigurationManager.AppSettings["Mail_Port"].ToString());
                //smtpClient.Credentials = new System.Net.NetworkCredential(mailset.SmtpMail, mailset.SmtpPasswd);
                smtpClient.UseDefaultCredentials = true;
                smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;

                message.From = fromAddress;
                IEnumerator<MailAddress> enumto = toaddr.GetEnumerator();
                while (enumto.MoveNext()) {
                    message.To.Add(enumto.Current);
                }

                if (ccaddr != null) {
                    IEnumerator<MailAddress> enumcc = ccaddr.GetEnumerator();
                    while (enumcc.MoveNext()) {
                        message.CC.Add(enumcc.Current);
                    }
                }
                if (bccaddr != null)
                {
                    IEnumerator<MailAddress> enumcc = bccaddr.GetEnumerator();
                    while (enumcc.MoveNext())
                    {
                        message.Bcc.Add(enumcc.Current);
                    }
                }
                message.Subject = subject;
                message.IsBodyHtml = true;
                message.Body = mailbody;
                smtpClient.Send(message);
                return "ok";
            }
            catch (Exception ex) {
                return (ex.Message);
            }
        }
    }
}